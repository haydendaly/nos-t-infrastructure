# To-Do

These are remaining tasks I have semi-ordered by priority.
1. Fix multi-init bug
2. Fix download by removing auto download on API and add button to download through API on the frontend.
3. Limit logs to most recent 100 by default
4. Add documentation/checklist for building components for the system.
5. Fix components to run off new init schema
6. Scaled realtime -> no synchronization algorithm
    - Start time
    - Running speed
    - End time
    - Timer running
7. Fix components to run off new init schema
8. Propogation with Orekit (or AstroPy and Skyfield).
9. Add access to Solace client (add to Control and nginx.conf)
10. Auto-generate docker-compose based off component script. Maybe create a `.yml` to specify connections and other system info.
11. Add localized resources for nodes of the system like graphs of observations -> would have to add Flask endpoints to components and perform GET on control frontend.
