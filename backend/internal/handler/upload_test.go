package handler

import (
	"bytes"
	"image"
	"image/png"
	"mime/multipart"
	"testing"
)

func TestImageValidation(t *testing.T) {
	var img bytes.Buffer
	png.Encode(&img, image.NewRGBA(image.Rect(0, 0, 2, 2)))
	for _, tc := range []struct {
		name string
		data []byte
		ok   bool
	}{{"real.png", img.Bytes(), true}, {"fake.png", []byte("<script>alert(1)</script>"), false}, {"wrong.jpg", img.Bytes(), false}, {"truncated.png", img.Bytes()[:12], false}} {
		var body bytes.Buffer
		w := multipart.NewWriter(&body)
		p, _ := w.CreateFormFile("file", tc.name)
		p.Write(tc.data)
		w.Close()
		r := multipart.NewReader(&body, w.Boundary())
		f, e := r.ReadForm(1024)
		if e != nil {
			t.Fatal(e)
		}
		if got := isAllowedImage(f.File["file"][0]); got != tc.ok {
			t.Errorf("%s: %v", tc.name, got)
		}
		f.RemoveAll()
	}
}
