import docker
import os


if "RESTART_RABBIT" in os.environ:
    restart_rabbit = os.environ.get("RESTART_RABBIT") == "True"
else:
    restart_rabbit = True


def do_docker_cleanup():

    cli = docker.DockerClient(base_url='unix://var/run/docker.sock')

    all_containers = cli.containers.list(all=True)

    tactic_image_names = ["tactic_tile_image", "tactic_main_image", "tactic_megaplex_image", "module_viewer_image",
                          "tactic_host_image"]
    if restart_rabbit:
        tactic_image_names += ["rabbitmq:3-management", "rabbitmq"]
    for cont in all_containers:
        if cont.attrs["Config"]["Image"] in tactic_image_names:
            cont.remove(force=True)
        # if cont["Image"] == cont["ImageID"]:
        #     cont.remove(force=True)

    dangling_images = cli.images.list(filters={"dangling": True})
    for img in dangling_images:
        cli.images.remove(img.id, force=True)
