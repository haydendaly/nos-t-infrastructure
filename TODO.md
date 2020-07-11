# To-Do

These are remaining tasks I have semi-ordered by priority.
1. Add initialization / component information on control before start sequence (maybe add topic/runtime).
2. Add startup options as form potentially. Starting time stamp.
3. Add localized resources for nodes of the system like graphs of observations -> would have to add Flask endpoints to components and perform GET on control frontend.
4. Auto-generate docker-compose based off component script. Maybe create a `.yml` to specify connections and other system info.
5. Potentially recreate control as React app.
6. Propogation with Orekit (or AstroPy and Skyfield).
7. Flesh out schema -> getting started
8. Scaled realtime -> no synchronization algorithm
    - Start time
    - Running speed
    - End time
    - Timer running ?
