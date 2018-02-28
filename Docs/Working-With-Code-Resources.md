There is a type of resource called a "code" resource that you can have in your library. This is where you can create independent functions and classes that can be called upon by your tiles.

A code resource can contain multiple functions and classes, if you like. 

```python
@user_function
def test_function():
	return "hello2"

@user_class
class TestClass(object):
    def __init__(self):
        self.my_var = "some text"
        
    def return_it(self):
        return self.my_var
```
As shown above, you use the decorator `@user_function` to declare a user function, and `@user_class` for classes.

At this point, none of the class-related code has been tested.

The [tile commands](tile-commands) section of this documentation explains how to access user functions and classes.

You can assign **tags** to code resources, just like with any other resources in your library. This is important, because access to functions will sometimes depend on these tags. But note that the tags given to a code resource apply to all of the functions and classes in entire code resource.