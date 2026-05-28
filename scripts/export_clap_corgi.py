import math
from pathlib import Path

import bpy


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "models" / "clap-corgi.glb"


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def mat(name, color, roughness=0.72):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = roughness
    return material


FUR = None
CREAM = None
DARK = None
NOSE = None
INNER = None


def sphere(name, loc, scale, material, segments=48, rings=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    return obj


def cone(name, loc, radius1, radius2, depth, material, rotation=(0, 0, 0), vertices=48):
    bpy.ops.mesh.primitive_cone_add(
        vertices=vertices,
        radius1=radius1,
        radius2=radius2,
        depth=depth,
        location=loc,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    return obj


def cube(name, loc, scale, material):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    bevel = obj.modifiers.new("soft bevel", "BEVEL")
    bevel.width = 0.12
    bevel.segments = 16
    obj.modifiers.new("soft body", "WEIGHTED_NORMAL")
    return obj


def build_corgi():
    global FUR, CREAM, DARK, NOSE, INNER

    FUR = mat("warm corgi orange fur", (0.78, 0.38, 0.13, 1))
    CREAM = mat("soft cream white fur", (0.96, 0.88, 0.74, 1))
    DARK = mat("glossy black eyes", (0.02, 0.017, 0.014, 1), 0.28)
    NOSE = mat("soft black nose", (0.018, 0.014, 0.012, 1), 0.38)
    INNER = mat("warm inner ear", (0.86, 0.48, 0.34, 1))
    PAW = mat("taupe paws", (0.48, 0.38, 0.31, 1))

    # Short rounded corgi body.
    sphere("body", (0, 0, 1.05), (1.35, 0.72, 0.58), FUR)
    sphere("chest patch", (0.52, -0.05, 1.12), (0.56, 0.55, 0.46), CREAM)

    # Head, cheeks, muzzle.
    sphere("head", (0.92, 0, 1.8), (0.74, 0.62, 0.66), FUR)
    sphere("white face stripe", (1.03, 0, 1.92), (0.22, 0.48, 0.55), CREAM)
    sphere("left cheek", (1.28, -0.3, 1.62), (0.28, 0.28, 0.22), CREAM)
    sphere("right cheek", (1.28, 0.3, 1.62), (0.28, 0.28, 0.22), CREAM)
    sphere("round muzzle", (1.42, 0, 1.55), (0.34, 0.34, 0.24), CREAM)
    sphere("nose", (1.72, 0, 1.62), (0.16, 0.13, 0.1), NOSE, 32, 16)

    # Big expressive eyes.
    sphere("left eye", (1.48, -0.28, 1.95), (0.09, 0.075, 0.13), DARK, 32, 16)
    sphere("right eye", (1.48, 0.28, 1.95), (0.09, 0.075, 0.13), DARK, 32, 16)
    sphere("left eye highlight", (1.55, -0.31, 2.01), (0.026, 0.02, 0.026), CREAM, 16, 8)
    sphere("right eye highlight", (1.55, 0.25, 2.01), (0.026, 0.02, 0.026), CREAM, 16, 8)

    # Upright corgi ears.
    cone("left ear", (0.85, -0.44, 2.42), 0.28, 0.04, 0.88, FUR, rotation=(0.28, -0.2, 0.28))
    cone("right ear", (0.85, 0.44, 2.42), 0.28, 0.04, 0.88, FUR, rotation=(-0.28, -0.2, -0.28))
    cone("left inner ear", (0.9, -0.43, 2.42), 0.18, 0.02, 0.62, INNER, rotation=(0.28, -0.2, 0.28), vertices=32)
    cone("right inner ear", (0.9, 0.43, 2.42), 0.18, 0.02, 0.62, INNER, rotation=(-0.28, -0.2, -0.28), vertices=32)

    # Stubby legs and big paws.
    for x in (-0.62, 0.55):
        for y in (-0.36, 0.36):
            cube(f"leg {x} {y}", (x, y, 0.55), (0.18, 0.18, 0.42), FUR)
            sphere(f"paw {x} {y}", (x + 0.08, y, 0.18), (0.25, 0.2, 0.13), PAW, 32, 16)

    # Small round corgi tail.
    sphere("round tail", (-1.28, 0, 1.22), (0.23, 0.23, 0.2), CREAM, 32, 16)

    # Collar as brand accent.
    collar = cone("gold collar", (0.44, 0, 1.52), 0.54, 0.54, 0.08, mat("mapclap gold", (0.94, 0.68, 0.25, 1)), rotation=(0, math.pi / 2, 0))
    collar.scale.y = 1.18


def add_camera_light():
    bpy.ops.object.light_add(type="AREA", location=(1.2, -3.4, 5.0))
    light = bpy.context.object
    light.name = "large softbox"
    light.data.energy = 560
    light.data.size = 4.0

    bpy.ops.object.camera_add(location=(4.0, -4.2, 2.6), rotation=(math.radians(64), 0, math.radians(43)))
    bpy.context.scene.camera = bpy.context.object


def export():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(OUT),
        export_format="GLB",
        export_yup=True,
        export_apply=True,
        export_materials="EXPORT",
    )


clear_scene()
build_corgi()
add_camera_light()
export()
print(f"Exported {OUT}")
