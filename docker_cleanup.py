import docker

def do_docker_cleanup():
    cli = docker.Client(base_url='unix://var/run/docker.sock')

    all_containers = cli.containers(all=True)

    for cont in all_containers:
        if cont["Image"] in ["tactic_tile_image", "tactic_main_image", "tactic_megaplex_image"]:
            cli.remove_container(cont["Id"], force=True)
            continue
        if cont["Image"] == cont["ImageID"]:
            cli.remove_container(cont["Id"], force=True)

    dangling_images = cli.images(all=True, filters={"dangling": True})
    for img in dangling_images:
        cli.remove_image(img["Id"], force=True)
