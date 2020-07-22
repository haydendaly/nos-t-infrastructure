# To-Do

These are remaining tasks I have semi-ordered by priority.
1. Fix multi-init bug
2. Fix download by removing auto download on API and add button to download through API on the frontend.
3. Add documentation/checklist for building components for the system.
4. Scaled realtime -> no synchronization algorithm
    - Start time
    - Running speed
    - End time
    - Timer running
5. Propogation with Orekit (or AstroPy and Skyfield).
6. Add access to Solace client (add to Control and nginx.conf)
7. Auto-generate docker-compose based off component script. Maybe create a `.yml` to specify connections and other system info.
8. Add localized resources for nodes of the system like graphs of observations -> would have to add Flask endpoints to components and perform GET on control frontend.
