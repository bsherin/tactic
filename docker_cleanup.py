import docker

def do_docker_cleanup():

    cli = docker.DockerClient(base_url='unix://var/run/docker.sock')

    all_containers = cli.containers.list(all=True)

    tactic_script_names = ["forwarder_main.py", "megaplex_main:app", "tile_main.py", "main_main.py", "module_viewer_main.py"]
    for cont in all_containers:
        for arg in cont.attrs["Args"]:
            if arg in tactic_script_names:
                cont.remove(force=True)
                break
        # if cont["Image"] == cont["ImageID"]:
        #     cont.remove(force=True)

    dangling_images = cli.images.list(filters={"dangling": True})
    for img in dangling_images:
        cli.images.remove(img.id, force=True)