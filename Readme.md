Oreo Cow Milk: Turning a Cannes Campaign into Code
The brief
 VML's award-winning Oreo cows campaign made a bold idea tangible: milk from cows that look like cookies. The brief was to turn that campaign into code, a jaw-dropping interactive piece.
The idea
 Instead of watching the campaign, you step into it. You hold the cow to milk her, fill the glass, then twist the Oreo. It splits, crumbs explode, and the creme opens into a spinning galaxy. The twist-and-split mechanic builds on an earlier "OREO RIFT" concept.
The build
 The piece is a single-page experience in plain JavaScript and Canvas, with no frameworks. The Belted Galloway cow is a generated sprite sheet of 16 shaded, furry frames, produced by a Python script. Sound is synthesised in the browser: a moo, a snap and a crunch. Gyro support lets phone users twist the cookie by tilting the device.
Extending it
 A companion AR prototype (Vite, MindAR, Three.js, GSAP) places the same cookie split and galaxy on a printed mural marker.
Outcome
 The result is a playable prototype that runs from one HTML file, with touch and gyro controls. It shows how a campaign can become something people play, not just watch. Next steps are photographic cow sprites, user testing and performance profiling.
I haven't tested the project on real devices or with real users
