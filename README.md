# Vortex

#### Building from source code

To build from source you have two choices.
### 1) Automatic (mostly):
- Download _bootstrap.ps1_ and run as a powershell script
  - In the dialog that shows up, select a build directory (should be a clean/new one)
  - This script will try to download and install all dependencies, then check out and build vortex
  - The dependencies are not installed headless so you have to click through the dialogs but it's only guaranteed to work if you keep the defaults

### 2) Manual:
- Before you can build vortex you need to download and install a couple of dependencies. If any of the download links is no longer valid, try google or a search engine of your choice.

##### Node.js
- Download installer from [nodejs.org](https://nodejs.org) and run the installer
- Version should not matter, the latest LTS version should be fine
- Verify that Node has installed successfully by running `node --version` in your _cmd_ or _terminal_

##### Yarn
- Run `npm install --global yarn`
- Verify that Yarn has installed successfully by running `yarn --version` in your _cmd_ or _terminal_

##### Git
- Download installer (64-bit) from [git-scm.com](https://git-scm.com/downloads) and run installer
- Verify that Git has installed successfully byb running `git --version` in your _cmd_ or _terminal_

##### Python
- Required for one of the build tools (_node-gyp_). At the time of writing versions _3.7-3.10_ are known to work
- Download installer (64-bit) from [python.org](https://www.python.org/downloads/) and run installer
- Make sure to have it added to `PATH`, otherwise defaults are fine.
  - If you have trouble refer to [How to add Python to PATH variable in Windows](https://www.educative.io/answers/how-to-add-python-to-path-variable-in-windows)
  - You can disable samples and documentation if you want

##### CMake
- Required for some of the native builds, All versions that are even remotely recent should work
- Download installer (x64) from [cmake.org](https://cmake.org/download/#latest) and run installer
- Enable the option to add to `PATH` (for the current user or all users)

##### Visual c++ build tools 2022 or Visual Studio 2022 (Community Edition)
- Download installer from [visualstudio.microsoft.com](https://visualstudio.microsoft.com/en/downloads/) 
  - You may have to google around for this as Microsoft tends to change their sitemap all the bloody time
- Under "Workloads", enable "Desktop Development with C++"
- Under "Individual Components", enable ".NET 6.0 Runtime (LTS)", ".NET SDK", "C++ ATL for latest vXYZ build tools" and "Windows 1x SDK" (any version should be fine)

##### Set up yarn to use C++ build tools
- Run `yarn config set msvs_version 2022 --global`
  - This sets up yarn to use the c++ build tools we just installed, you probably only need to do this if you've also installed other versions of Visual Studio. Can't hurt though

#### Cloning and building the Vortex source code
- Start a new command line prompt at this point to ensure you're using the updated PATH environment.
- Create and `cd` to an appropriate directory (i.e. _c:\projects_)
- `git clone https://github.com/Nexus-Mods/Vortex.git` from the created directory
  - this should create a new directory _vortex_ in the current working directory (i.e. _c:\projects\vortex_)
- cd into the vortex directory `cd vortex`
- Switch to an appropriate branch, if necessary
  - `git checkout some_branch`
- For development
  - `yarn install` to install dependencies
  - `yarn build` to build
  - `yarn start` to run
- For production
  - The scripts (_electron-builder-oneclick.json_ and _electron-builder-advanced.json_) are set up to require code signing with
    a certificate you don't have so change that
  - `yarn dist` to build (this will take a while)
  - Find the installer and an already unpacked version in dist

### If something goes wrong:

There are two phases to the process, installing dependencies and building.
However, dependent modules may also be compiled during the install phase, this is particularly true for native modules (modules written in C++ for example rather than javascript) if no pre-build binaries are available online. Thus you might get compilation errors during the "yarn install" step.

If the install step fails with an error mentioning c++ or node-gyp or cmake, this will usually mean that one of the tools (python, cmake, visual studio build tools) were not installed (correctly) or can't be found, please repeat the corresponding step above and double check you followed the instructions. Then repeat the "yarn install" step.
Unfortunately, with these tools being installed system-wide, it's also possible that your existing installs of other versions of these tools (visual studio build tools in particular) may interfere. We can only really promise this build works on a clean windows.

There is one component, fomod-installer, written in c# and at the time of writing its build will randomly fail for no reason. In this case you don't have to do anything special, just repeat the install step.

If the error message shows an error from webpack or a javascript error, this may mean that some package was updated and broke compatibility. It may also mean typescript is outdated.
Another possible error may be that your yarn cache is invalid such that even if you reinstall a package you still get a broken variant.
The yarn cache is at _%LOCALAPPDATA%\\Yarn\\Cache\\v6_ and it's safe to delete it, that will only cause some additional internet traffic.

The automatic variant will skip dependency download and install if the download was installed previously. If a dependency install failed for some reason or you cancelled it, you will have to manually install that package (see the downloads directory).

------
# Further Information

- see [structure.md](structure.md) for an overview of how the project is organized
- see [https://nexus-mods.github.io/vortex-api](https://nexus-mods.github.io/vortex-api/) for a description of the extension api
- see [https://wiki.nexusmods.com/index.php/Vortex](https://wiki.nexusmods.com/index.php/Vortex) for usage information

# Reporting bugs

Please report issues to the issue tracker on github. Please always include at the very least the following information:
- The exact version of Vortex you're using
- Your operating system
- What you were doing when the bug happened
- What exactly the bug is (crash? error messages? unexpected behaviour?)
- If you get any error message, include the full and exact error message. Do not paraphrase, do not leave out information that looks cryptic or unimportant to you
- The log file (see below)
- Ideally also the application state (see below)

All data the client generates (including settings and logs) are stored at

_C:\Users\\<username\>\AppData\Roaming\Vortex_ (releases)

or

_C:\Users\\<username\>\AppData\Roaming\vortex\_devel_ (development build)

If you need to report a bug, the following files inside that directory may be useful in addition to the error message displayed on screen:

- vortex.log (logs are rotated at a certain size, this is the latest one)
- state\\* except global_account (that one contains keys and passwords so sensitive information)
- \<game\>\state\* (if the bug pertains to a specific game)
