import docker
import os



if "RESTART_RABBIT" in os.environ:
    restart_rabbit = os.environ.get("RESTART_RABBIT") == "True"
else:
    restart_rabbit = True


def do_docker_cleanup():

    cli = docker.DockerClient(base_url='unix://var/run/docker.sock')

    all_containers = cli.containers.list(all=True)

    tactic_image_names = ["bsherin/tactic:tile", "bsherin/tactic:main",
                          "bsherin/tactic:module_viewer", "bsherin/tactic:host"]
    if restart_rabbit:
        tactic_image_names += ["rabbitmq:3-management", "rabbitmq", "bsherin/tactic:host", "redis:alpine", "mongo"]
    for cont in all_containers:
        if cont.attrs["Config"]["Image"] in tactic_image_names:
            cont.remove(force=True)
        # if cont["Image"] == cont["ImageID"]:
        #     cont.remove(force=True)

    dangling_images = cli.images.list(filters={"dangling": True})
    for img in dangling_images:
        cli.images.remove(img.id, force=True)


