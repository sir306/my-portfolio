
export function cleanupScene(scene, renderer, id) {
  if (id) {
    cancelAnimationFrame(id);
  }
  
  if (scene) {
    scene.traverse((object) => {
      // Dispose Geometries
      if (object.geometry) {
        object.geometry.dispose();
      }

      // Dispose Materials
      if (object.material) {
        if (Array.isArray(object.material)) {
           object.material.forEach(m => cleanMaterial(m));
        } else {
           cleanMaterial(object.material);
        }
      }
    });
    
    // Clear children
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
  }
  
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss(); // Aggressively free context
    
    // Remove canvas from DOM if it was appended (though Vue usually handles this via refs)
    if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }
}

function cleanMaterial(material) {
  material.dispose();
  // Dispose textures if any
  for (const key of Object.keys(material)) {
    const value = material[key];
    if (value && typeof value === 'object' && 'minFilter' in value) {
        // It's likely a Texture
        value.dispose();
    }
  }
}
