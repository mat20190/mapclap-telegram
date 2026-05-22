Сюда нужно положить экспортированную Blender-модель Клэпа:

```text
public/models/clap-corgi.glb
```

Telegram Mini App не может открыть `.blend` напрямую. Для web нужна модель в формате `.glb` или `.gltf`.

Рекомендуемый экспорт из Blender:

1. File -> Export -> glTF 2.0
2. Format: glTF Binary (.glb)
3. Filename: `clap-corgi.glb`
4. Положить файл в эту папку

После этого можно заменить CSS-маскота на 3D-viewer в `src/App.jsx`.
