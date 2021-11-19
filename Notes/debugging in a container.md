

#### This is the current state as of February 2, 2010

In the past, I thought pydevd_pycharm must be imported before monkey patching or breakpoints
don't work. But that doesn't seem true anymore.

I just need to place a settrace whereever

### Procedure for debugging

1. There needs to be a dockerfile for the container that does this.

    ```RUN pip install pydevd-pycharm~=193.5233.109```
    new vesion ```RUN pip install pydevd-pycharm~=201.6668.115```
    newer version ``` RUN pip install pydevd-pycharm~-213.5605.23```

3. Insert these lines somewhere near to where I want to debug. I also need to import pydevd_pycharm before 
   monkey_patching.
   
```python
import pydevd_pycharm
pydevd_pycharm.settrace('docker.for.mac.localhost', port=21000, stdoutToServer=True, stderrToServer=True, suspend=True)
```
   
2a. If I want to debug in only one of the host containers, then I will need this instead

```python
if "DEBUG_CONTAINER" in os.environ:
    import pydevd_pycharm
    pydevd_pycharm.settrace('docker.for.mac.localhost', port=21000, stdoutToServer=True, stderrToServer=True, suspend=True)
```

3. Launch one of the Python Remote Debug configurations.

    They are the same, except for the directory mappings.

4. Run the tactic launch script if necessary.

4a. If I am going to use the `if "DEBUG_CONTAINER" in os.environ:` version in `host_main`, then I will need
to launch the script with a configuration that makes this true. Also, I might need to tweak `launch_tactic` 
so that the desired container is the one that attaches to the debugger. 

5. Then navigate in Tactic to the place to be debugged.

