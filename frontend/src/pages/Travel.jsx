import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  createTravelPlace,
  deleteTravelPlace,
  isBackendOfflineError,
  listTravelPlaces,
  updateTravelPlace,
} from "../api";
import ConstructionNotice from "../components/ConstructionNotice";

const TravelGlobe = lazy(() => import("../components/TravelGlobe"));

const emptyDraft = {
  id: null,
  name: "",
  latitude: "",
  longitude: "",
  gallery: "",
  route: "",
};

function draftFromPlace(place) {
  if (!place) return emptyDraft;
  return {
    id: place.id,
    name: place.name,
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    gallery: (place.gallery || []).join("\n"),
    route: (place.route || []).map((point) => `${point.latitude}, ${point.longitude}`).join("\n"),
  };
}

function placeInputFromDraft(draft) {
  const route = draft.route
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [latitude, longitude] = line.split(",").map((value) => Number(value.trim()));
      return { latitude, longitude };
    });

  return {
    name: draft.name.trim(),
    latitude: Number(draft.latitude),
    longitude: Number(draft.longitude),
    gallery: draft.gallery.split("\n").map((value) => value.trim()).filter(Boolean),
    route,
  };
}

function coordinateText(place) {
  return `${Number(place.latitude).toFixed(4)}°, ${Number(place.longitude).toFixed(4)}°`;
}

function Travel({ user, onOpenSignIn, onLogout, onNotify }) {
  const location = useLocation();
  const [places, setPlaces] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const handledDeskRequest = useRef("");

  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedId) || null,
    [places, selectedId]
  );

  const loadPlaces = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listTravelPlaces();
      const nextPlaces = response.data?.data || [];
      setPlaces(nextPlaces);
      setSelectedId((current) => current ?? nextPlaces[0]?.id ?? null);
    } catch (requestError) {
      setError(isBackendOfflineError(requestError) ? "Travel records are waiting for the backend connection." : "Locations could not be loaded right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadPlaces();
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, [loadPlaces]);

  const selectPlace = useCallback((place) => {
    setSelectedId(place.id);
    setDraft(draftFromPlace(place));
    setEditorOpen(Boolean(user?.token));
  }, [user?.token]);

  useEffect(() => {
    const openEditor = () => {
      if (!user?.token) return;
      setSelectedId(null);
      setDraft(emptyDraft);
      setError("");
      setEditorOpen(true);
    };

    window.addEventListener("fyuo:edit-place", openEditor);
    return () => window.removeEventListener("fyuo:edit-place", openEditor);
  }, [user?.token]);

  useEffect(() => {
    const parameters = new URLSearchParams(location.search);
    const request = parameters.get("desk");
    if (!user?.token || !request || handledDeskRequest.current === location.search) return;

    const timer = window.setTimeout(() => {
    if (request === "new") {
      setSelectedId(null);
      setDraft(emptyDraft);
      setError("");
      setEditorOpen(true);
      handledDeskRequest.current = location.search;
      return;
    }

    const requestedID = Number(parameters.get("id"));
    const place = places.find((item) => item.id === requestedID);
    if (request === "edit" && place) {
      selectPlace(place);
      handledDeskRequest.current = location.search;
    }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [location.search, places, selectPlace, user?.token]);

  const updateDraft = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const savePlace = async (event) => {
    event.preventDefault();
    if (!user?.token) {
      onLogout?.();
      onOpenSignIn();
      return;
    }

    const payload = placeInputFromDraft(draft);
    if (!payload.name || !Number.isFinite(payload.latitude) || !Number.isFinite(payload.longitude)) {
      setError("A name plus valid latitude and longitude are required.");
      return;
    }
    if (payload.route.some((point) => !Number.isFinite(point.latitude) || !Number.isFinite(point.longitude))) {
      setError("Each route waypoint needs a latitude and longitude, separated by a comma.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = draft.id
        ? await updateTravelPlace(draft.id, payload, user.token)
        : await createTravelPlace(payload, user.token);
      const saved = response.data?.data;
      setPlaces((current) => draft.id ? current.map((place) => (place.id === saved.id ? saved : place)) : [saved, ...current]);
      selectPlace(saved);
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        onLogout?.();
        onOpenSignIn();
      }
      const message = isBackendOfflineError(requestError)
        ? "The backend is unavailable, so this location was not saved."
        : requestError?.response?.data?.error || "This location could not be saved.";
      setError(message);
      onNotify?.({ title: "travel edit unavailable.", message });
    } finally {
      setSaving(false);
    }
  };

  const removePlace = async () => {
    if (!draft.id || !user?.token) {
      if (!user?.token) {
        onLogout?.();
        onOpenSignIn();
      }
      return;
    }
    const previous = places;
    setPlaces((current) => current.filter((place) => place.id !== draft.id));
    setSelectedId(null);
    setDraft(emptyDraft);
    try {
      await deleteTravelPlace(draft.id, user.token);
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        onLogout?.();
        onOpenSignIn();
      }
      setPlaces(previous);
      setSelectedId(draft.id);
      const message = isBackendOfflineError(requestError)
        ? "The backend is unavailable, so the location was restored."
        : requestError?.response?.data?.error || "The location could not be deleted and was restored.";
      setError(message);
      onNotify?.({ title: "travel deletion unavailable.", message });
    }
  };

  return (
    <div className="travel-page travel-page--globe">
      <ConstructionNotice />
      <header className="travel-globe-masthead">
        <p className="travel-globe-masthead__edition">FYUO863 / GEO ARCHIVE</p>
        <h1>Earth, marked.</h1>
        <div className="travel-globe-masthead__footer">
          <p>Every pin starts with a coordinate. Routes are optional; the globe is the index.</p>
        </div>
      </header>

      <section className="travel-globe-stage" aria-labelledby="travel-globe-title">
        <div className="travel-globe-stage__caption">
          <p id="travel-globe-title">Drag to rotate. Select a red point to inspect it.</p>
          <div>
            <span>{loading ? "loading coordinates…" : `${places.length} saved ${places.length === 1 ? "location" : "locations"}`}</span>
            <span>NASA Blue + Black Marble / celestial ink field</span>
          </div>
        </div>
        <Suspense fallback={<div className="travel-globe__fallback" role="status" aria-label="Loading globe." />}>
          <TravelGlobe places={places} onSelectPlace={selectPlace} />
        </Suspense>

        {selectedPlace ? (
          <article className="travel-globe-note" aria-live="polite">
            <p className="travel-globe-note__index">PIN {String(places.indexOf(selectedPlace) + 1).padStart(2, "0")}</p>
            <h2>{selectedPlace.name}</h2>
            <p>{coordinateText(selectedPlace)}</p>
            {selectedPlace.gallery?.[0] && (
              <img src={selectedPlace.gallery[0]} alt={`${selectedPlace.name} travel record`} loading="lazy" />
            )}
          </article>
        ) : (
          <p className="travel-globe-stage__empty" role="status">{error || "No coordinates have been indexed yet."}</p>
        )}
      </section>

      {user && editorOpen && (
        <section className="travel-place-editor" aria-labelledby="travel-place-editor-title">
          <header>
            <p>AUTHORISED FIELD EDITOR</p>
            <h2 id="travel-place-editor-title">{draft.id ? "Adjust a pin." : "Mark a place."}</h2>
          </header>
          <form onSubmit={savePlace}>
            <label>
              Name
              <input name="name" value={draft.name} onChange={updateDraft} required placeholder="Kyoto" />
            </label>
            <label>
              Latitude
              <input name="latitude" value={draft.latitude} onChange={updateDraft} required inputMode="decimal" placeholder="35.0116" />
            </label>
            <label>
              Longitude
              <input name="longitude" value={draft.longitude} onChange={updateDraft} required inputMode="decimal" placeholder="135.7681" />
            </label>
            <label className="travel-place-editor__wide">
              Gallery URLs
              <textarea name="gallery" value={draft.gallery} onChange={updateDraft} placeholder="https://…/frame-01.jpg\nhttps://…/frame-02.jpg" />
              <small>One image URL per line. The first image becomes the pin preview.</small>
            </label>
            <label className="travel-place-editor__wide">
              Route waypoints
              <textarea name="route" value={draft.route} onChange={updateDraft} placeholder="35.0116, 135.7681\n35.0200, 135.7750" />
              <small>Optional. One “latitude, longitude” pair per line.</small>
            </label>
            {error && <p className="travel-place-editor__error" role="alert">{error}</p>}
            <div className="travel-place-editor__actions">
              <button className="travel-globe__action" type="submit" disabled={saving}>{saving ? "saving…" : draft.id ? "save pin." : "add pin."}</button>
              {draft.id && <button className="travel-globe__action travel-globe__action--quiet" type="button" onClick={removePlace}>delete pin.</button>}
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export default Travel;
