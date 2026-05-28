import bpy
from mathutils import Vector


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def mat(name, color):
    material = bpy.data.materials.new(name)
    material.diffuse_color = color
    return material


def cube(name, loc, scale, material):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    return obj


def sphere(name, loc, scale, material):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    return obj


def wheel(x, y, z, material):
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.18, depth=0.12, location=(x, y, z), rotation=(1.5708, 0, 0))
    obj = bpy.context.object
    obj.name = "wheel"
    obj.data.materials.append(material)
    return obj


def make_corgi_head(x, y, z):
    orange = mat("corgi orange", (0.78, 0.42, 0.18, 1))
    cream = mat("corgi cream", (0.95, 0.9, 0.78, 1))
    black = mat("soft black", (0.02, 0.018, 0.015, 1))
    head = sphere("clap head", (x, y, z), (0.38, 0.32, 0.34), orange)
    sphere("white muzzle", (x - 0.18, y, z - 0.08), (0.18, 0.2, 0.11), cream)
    sphere("nose", (x - 0.33, y, z - 0.04), (0.06, 0.05, 0.04), black)
    sphere("left eye", (x - 0.18, y - 0.14, z + 0.08), (0.045, 0.035, 0.045), black)
    sphere("right eye", (x - 0.18, y + 0.14, z + 0.08), (0.045, 0.035, 0.045), black)
    bpy.ops.mesh.primitive_cone_add(vertices=32, radius1=0.14, radius2=0.02, depth=0.42, location=(x, y - 0.24, z + 0.34), rotation=(0.2, -0.2, 0.15))
    bpy.context.object.name = "left corgi ear"
    bpy.context.object.data.materials.append(orange)
    bpy.ops.mesh.primitive_cone_add(vertices=32, radius1=0.14, radius2=0.02, depth=0.42, location=(x, y + 0.24, z + 0.34), rotation=(-0.2, -0.2, -0.15))
    bpy.context.object.name = "right corgi ear"
    bpy.context.object.data.materials.append(orange)
    return head


def make_car(offset_x):
    yellow = mat("taxi yellow", (0.94, 0.74, 0.25, 1))
    black = mat("rubber", (0.02, 0.02, 0.02, 1))
    glass = mat("glass blue", (0.55, 0.75, 0.95, 0.65))
    cube("car body", (offset_x, 0, 0.45), (1.1, 0.46, 0.28), yellow)
    cube("car cabin", (offset_x - 0.08, 0, 0.78), (0.62, 0.38, 0.24), glass)
    make_corgi_head(offset_x - 0.5, 0, 0.95)
    for x in (-0.62, 0.62):
        for y in (-0.36, 0.36):
            wheel(offset_x + x, y, 0.2, black)


def make_bus(offset_x, name, color):
    body_mat = mat(name, color)
    black = mat(f"{name} rubber", (0.02, 0.02, 0.02, 1))
    glass = mat(f"{name} glass", (0.7, 0.86, 1, 0.65))
    cube(f"{name} body", (offset_x, 0, 0.55), (1.55, 0.48, 0.42), body_mat)
    for i in range(4):
        cube(f"{name} window {i}", (offset_x - 0.65 + i * 0.38, -0.5, 0.72), (0.13, 0.03, 0.13), glass)
    make_corgi_head(offset_x - 0.72, -0.42, 0.9)
    for x in (-0.9, 0.9):
        for y in (-0.38, 0.38):
            wheel(offset_x + x, y, 0.2, black)


def make_bike(offset_x):
    green = mat("bike green", (0.12, 0.5, 0.34, 1))
    black = mat("bike black", (0.02, 0.02, 0.02, 1))
    cube("bike frame", (offset_x, 0, 0.42), (0.8, 0.04, 0.04), green)
    cube("bike handle", (offset_x - 0.48, 0, 0.78), (0.04, 0.04, 0.36), green)
    make_corgi_head(offset_x, 0, 1.0)
    wheel(offset_x - 0.55, 0, 0.24, black)
    wheel(offset_x + 0.55, 0, 0.24, black)


def make_scooter(offset_x):
    gold = mat("scooter gold", (0.94, 0.76, 0.38, 1))
    black = mat("scooter black", (0.02, 0.02, 0.02, 1))
    cube("scooter deck", (offset_x, 0, 0.32), (0.75, 0.08, 0.04), gold)
    cube("scooter handle", (offset_x - 0.48, 0, 0.72), (0.035, 0.035, 0.42), gold)
    make_corgi_head(offset_x, 0, 0.94)
    wheel(offset_x - 0.52, 0, 0.18, black)
    wheel(offset_x + 0.52, 0, 0.18, black)


clear_scene()
make_car(-4.2)
make_bus(-1.35, "bus", (0.24, 0.43, 0.72, 1))
make_bus(1.55, "trolley", (0.18, 0.5, 0.35, 1))
make_bike(4.1)
make_scooter(6.2)

bpy.ops.object.light_add(type="AREA", location=(0, -5, 6))
bpy.context.object.name = "large softbox"
bpy.context.object.data.energy = 500
bpy.context.object.data.size = 5
bpy.ops.object.camera_add(location=(1, -8, 4.2), rotation=(1.1, 0, 0.12))
bpy.context.scene.camera = bpy.context.object
