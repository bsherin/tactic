import docker

def do_docker_cleanup():

    cli = docker.DockerClient(base_url='unix://var/run/docker.sock')

    tactic_image_names = ["tactic_tile_image", "tactic_main_image", "tactic_megaplex_image", "forwarder_image"]
    tactic_image_ids = [cli.images.get(img_name).id for img_name in tactic_image_names]

    all_containers = cli.containers.list(all=True)

    for cont in all_containers:
        if cont.attrs["Image"] in tactic_image_ids:
            cont.remove(force=True)
            continue
        # if cont["Image"] == cont["ImageID"]:
        #     cont.remove(force=True)

    dangling_images = cli.images.list(filters={"dangling": True})
    for img in dangling_images:
        img.remove(force=True)
