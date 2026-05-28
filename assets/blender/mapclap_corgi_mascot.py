import bpy
from math import radians


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def mat(name, color, roughness=0.65, metallic=0):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return material


def sphere(name, loc, scale, material, segments=48):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=24, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    return obj


def cone(name, loc, radius1, depth, material, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cone_add(
        vertices=64,
        radius1=radius1,
        radius2=0.08,
        depth=depth,
        location=loc,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    return obj


def cylinder(name, loc, radius, depth, material, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=radius, depth=depth, location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    return obj


def add_keyframe(obj, frame, loc=None, rot=None, scale=None):
    if loc is not None:
        obj.location = loc
        obj.keyframe_insert(data_path="location", frame=frame)
    if rot is not None:
        obj.rotation_euler = rot
        obj.keyframe_insert(data_path="rotation_euler", frame=frame)
    if scale is not None:
        obj.scale = scale
        obj.keyframe_insert(data_path="scale", frame=frame)


clear_scene()

orange = mat("soft toy corgi orange", (0.72, 0.36, 0.14, 1))
dark_orange = mat("soft darker side fur", (0.48, 0.22, 0.08, 1))
cream = mat("warm white face and belly", (0.90, 0.86, 0.76, 1))
inner_ear = mat("muted pink inner ear", (0.62, 0.38, 0.32, 1))
black = mat("glossy black eyes nose", (0.01, 0.01, 0.012, 1), 0.18)
white = mat("bright eye catchlight", (1, 1, 0.96, 1), 0.22)
gold = mat("MapClap collar tag", (0.95, 0.70, 0.22, 1), 0.32, 0.05)

# Reference style: stylized toy corgi.
# Compact corgi body, no visible tail, short thick legs, big ears and a cute broad muzzle.
body = sphere("compact plush corgi body", (0.10, 0, 0.82), (1.18, 0.43, 0.47), orange)
ribcage = sphere("rounded front chest mass", (-0.62, 0, 0.91), (0.52, 0.43, 0.50), orange, 32)
haunch = sphere("rounded rear haunch", (0.82, 0, 0.78), (0.48, 0.40, 0.42), dark_orange, 32)
back_patch = sphere("soft darker back patch", (0.32, 0, 1.04), (0.78, 0.38, 0.20), dark_orange, 32)
belly = sphere("rounded white belly patch", (-0.05, -0.01, 0.60), (0.72, 0.34, 0.28), cream, 32)
chest = sphere("big vertical white chest", (-0.72, 0, 0.86), (0.38, 0.36, 0.48), cream, 32)
tail = sphere("fluffy visible corgi tail", (1.28, 0, 1.03), (0.38, 0.24, 0.22), orange, 32)
tail_tip = sphere("cream fluffy tail tip", (1.48, 0, 1.07), (0.18, 0.14, 0.12), cream, 24)
tail.rotation_euler[1] = radians(-24)
tail_tip.rotation_euler[1] = radians(-24)

head = sphere("large rounded corgi head", (-1.05, 0, 1.38), (0.62, 0.52, 0.55), orange)
forehead = sphere("soft corgi forehead dome", (-1.07, 0, 1.62), (0.50, 0.43, 0.30), orange, 32)
blaze = sphere("clean white corgi forehead stripe", (-1.22, 0, 1.48), (0.14, 0.12, 0.50), cream, 32)

# Build the muzzle as one rounded corgi face unit: broad white lower face,
# two soft cheek lobes, short bridge, and a nose placed on the front of the muzzle.
face_mask = sphere("rounded white corgi lower face", (-1.31, 0, 1.22), (0.39, 0.43, 0.33), cream, 32)
left_cheek = sphere("left plush corgi cheek lobe", (-1.42, -0.24, 1.18), (0.28, 0.24, 0.24), cream, 32)
right_cheek = sphere("right plush corgi cheek lobe", (-1.42, 0.24, 1.18), (0.28, 0.24, 0.24), cream, 32)
bridge = sphere("short rounded white snout bridge", (-1.47, 0, 1.34), (0.17, 0.16, 0.18), cream, 32)
muzzle = sphere("single rounded corgi muzzle pad", (-1.62, 0, 1.17), (0.29, 0.30, 0.22), cream, 32)
chin = sphere("small soft corgi chin", (-1.50, 0, 1.02), (0.22, 0.24, 0.12), cream, 24)
nose = sphere("front oval corgi nose", (-1.88, 0, 1.25), (0.14, 0.12, 0.085), black, 32)
smile_left = cylinder("left rounded smile crease", (-1.65, -0.10, 1.08), 0.012, 0.18, black, (radians(84), radians(0), radians(28)))
smile_right = cylinder("right rounded smile crease", (-1.65, 0.10, 1.08), 0.012, 0.18, black, (radians(84), radians(0), radians(-28)))

left_ear = cone("oversized left corgi ear", (-1.05, -0.39, 1.93), 0.31, 0.90, orange, (radians(10), radians(-13), radians(-12)))
right_ear = cone("oversized right corgi ear", (-1.05, 0.39, 1.93), 0.31, 0.90, orange, (radians(-10), radians(-13), radians(12)))
left_inner = cone("soft left inner ear", (-1.07, -0.385, 1.90), 0.19, 0.65, inner_ear, (radians(10), radians(-13), radians(-12)))
right_inner = cone("soft right inner ear", (-1.07, 0.385, 1.90), 0.19, 0.65, inner_ear, (radians(-10), radians(-13), radians(12)))

left_eye = sphere("extra large left shiny eye", (-1.50, -0.25, 1.48), (0.145, 0.090, 0.175), black, 32)
right_eye = sphere("extra large right shiny eye", (-1.50, 0.25, 1.48), (0.145, 0.090, 0.175), black, 32)
sphere("left big round catchlight", (-1.61, -0.285, 1.60), (0.040, 0.022, 0.040), white, 16)
sphere("right big round catchlight", (-1.61, 0.215, 1.60), (0.040, 0.022, 0.040), white, 16)
sphere("left star catchlight", (-1.62, -0.205, 1.39), (0.030, 0.016, 0.030), white, 16)
sphere("right small catchlight", (-1.62, 0.285, 1.39), (0.025, 0.014, 0.025), white, 16)

for x, y, name in [
    (-0.58, -0.27, "front left stump leg"),
    (-0.58, 0.27, "front right stump leg"),
    (0.72, -0.27, "back left stump leg"),
    (0.72, 0.27, "back right stump leg"),
]:
    cylinder(name, (x, y, 0.31), 0.14, 0.39, dark_orange)
    sphere(name + " chunky rounded paw", (x - 0.03, y, 0.08), (0.20, 0.15, 0.08), dark_orange, 24)

collar = cylinder("thin golden MapClap collar", (-0.75, 0, 1.05), 0.35, 0.07, gold, (radians(90), 0, 0))
tag = sphere("round collar tag", (-1.03, 0, 0.82), (0.10, 0.10, 0.025), gold, 24)

# Simple animation: mascot breathes, blinks, ears wiggle, tail wags.
for frame, z in [(1, 1.38), (24, 1.43), (48, 1.38)]:
    add_keyframe(head, frame, loc=(-1.05, 0, z))
for frame, rot in [(1, radians(-28)), (12, radians(-8)), (24, radians(-28))]:
    add_keyframe(tail, frame, rot=(0, rot, 0))
    add_keyframe(tail_tip, frame, rot=(0, rot, 0))
for frame, scale_z in [(1, 0.175), (18, 0.035), (24, 0.175)]:
    add_keyframe(left_eye, frame, scale=(0.145, 0.090, scale_z))
    add_keyframe(right_eye, frame, scale=(0.145, 0.090, scale_z))
for frame, rot_z in [(1, radians(-12)), (24, radians(-17)), (48, radians(-12))]:
    add_keyframe(left_ear, frame, rot=(radians(10), radians(-13), rot_z))
    add_keyframe(left_inner, frame, rot=(radians(10), radians(-13), rot_z))
for frame, rot_z in [(1, radians(12)), (24, radians(17)), (48, radians(12))]:
    add_keyframe(right_ear, frame, rot=(radians(-10), radians(-13), rot_z))
    add_keyframe(right_inner, frame, rot=(radians(-10), radians(-13), rot_z))

bpy.ops.object.light_add(type="AREA", location=(0, -4, 5))
bpy.context.object.name = "large softbox"
bpy.context.object.data.energy = 500
bpy.context.object.data.size = 5

bpy.ops.object.camera_add(location=(3.2, -5.4, 2.7), rotation=(radians(62), 0, radians(35)))
bpy.context.scene.camera = bpy.context.object

bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = 48
bpy.context.scene.render.fps = 24
bpy.context.scene.render.engine = "CYCLES"
bpy.context.scene.cycles.samples = 80
bpy.context.scene.view_settings.view_transform = "Filmic"
bpy.context.scene.view_settings.look = "Medium High Contrast"

bpy.ops.wm.save_as_mainfile(filepath="mapclap_corgi_mascot.blend")
bpy.ops.export_scene.gltf(filepath="mapclap_corgi_mascot.glb", export_format="GLB")
