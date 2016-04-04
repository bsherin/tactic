from __init__ import app, test_dict

from tasks import say_hello
print "starting"

@app.route('/')
def basic():
    test_dict["value"] += 1
    app.logger.debug("the basics test_var is " + str(test_dict["value"]))
    return "this is the basic test var is " + str(test_dict["value"])


@app.route('/celery_it')
def celery_it():
    say_hello.apply_async()
    return "started say hello"

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)