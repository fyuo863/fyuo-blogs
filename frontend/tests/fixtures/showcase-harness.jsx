/* eslint-disable react-refresh/only-export-components */
import {createRoot} from 'react-dom/client';
import {useShowcase} from '../../src/showcase/useShowcase';
import ProjectGrid from '../../src/module/ProjectGrid';
const config={repository:'example/showcase',branch:'main',path:'showcase.json',refreshSeconds:60};
function Harness(){
 const {albums,error}=useShowcase(config);
 return <><p role="status">{error}</p><ProjectGrid projects={albums || []}/></>;
}
createRoot(document.getElementById('root')).render(<Harness/>);
