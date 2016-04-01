
import docker

cli = docker.Client(base_url='unix://var/run/docker.sock')


# Note taht get_address assumes that the network is named usernet
def get_address(container_identifier, network_name):
    return cli.inspect_container(container_identifier)["NetworkSettings"]["Networks"][network_name]["IPAddress"]


def create_container(image_name, container_name=None, network_mode="bridge"):
    if container_name is None:
        container_id = cli.create_container(image=image_name,
                                            host_config=cli.create_host_config(network_mode=network_mode)
                                            )
    else:
        container_id = cli.create_container(image=image_name,
                                            name=container_name,
                                            host_config=cli.create_host_config(network_mode=network_mode))
    cli.start(container_id)
    return container_id


def create_network(network_name):
    return cli.create_network(network_name, "bridge")


def remove_network(network_name):
    return cli.remove_network(network_name)


def destroy_container(cname):
    try:
        return cli.remove_container(cname, force=True)
    except:
        return -1


def connect_to_network(container, network):
    return cli.connect_container_to_network(container, network)
