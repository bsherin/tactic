

#### This is the current state as of February 2, 2010

In the past, I thought pydevd_pycharm must be imported before monkey patching or breakpoints
don't work. But that doesn't seem true anymore.

I just need to place a settrace whereever

### Procedure for debugging

1. There needs to be a dockerfile for the container that does this. Remember it needs to be by arm64 version.

    * newest version: ```RUN pip install pydevd-pycharm``` or ```RUN pip install pydevd-pycharm~=231.8109.197```

3. Insert these lines somewhere near to where I want to debug. I might also need to import pydevd_pycharm before 
   monkey_patching. But it seems a little less fussy now.
   
```python
import pydevd_pycharm
pydevd_pycharm.settrace('docker.for.mac.localhost', port=21000, stdoutToServer=True, stderrToServer=True, suspend=True)
```
   
2a. If I want to debug in only one of the host containers, then I will need this instead

```python
import pydevd_pycharm
import os
myport = os.environ.get("MYPORT")
if myport == str(5000):
   pydevd_pycharm.settrace('docker.for.mac.localhost', port=21000, stdoutToServer=True, stderrToServer=True,
                           suspend=True)
```

3. Launch one of the Python Remote Debug configurations.

    They are the same, except for the directory mappings.

4. Run the tactic launch script if necessary.

4a. If I am going to use the `if "DEBUG_CONTAINER" in os.environ:` version in `host_main`, then I will need
to launch the script with a configuration that makes this true. Also, I might need to tweak `launch_tactic` 
so that the desired container is the one that attaches to the debugger. 

5. Then navigate in Tactic to the place to be debugged.

