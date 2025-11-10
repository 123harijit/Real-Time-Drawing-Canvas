# Real-Time Collaborative Drawing Canvas

A full-stack, real-time drawing application built with Node.js, Socket.io, and Vanilla HTML5 Canvas. This project meets the core requirements of the Flameworks assignment, including Global Undo/Redo, Real-time Sync, and a multi-room system.

## 🚀 Features

* **Real-time Synchronization:** Drawings are streamed as they happen across all users in the same room.
* **Global Undo/Redo:** History is managed on the server, allowing any user to globally revert or reapply the last action.
* **Room System:** Users join isolated canvases using a unique Room ID.
* **Tools:** Brush (custom color/width) and Eraser.
* **User Indicators:** Cursor positions are synced to show where other users are viewing/drawing.

## 🛠️ Setup and Installation

### Prerequisites

* [Node.js](https://nodejs.org/en/) (LTS recommended)

### Steps

1.  **Clone the Repository:**

    ```bash
    git clone [YOUR_REPO_URL]
    cd collaborative-canvas
    ```

2.  **Install Dependencies:**
    (Installs Express and Socket.io packages)

    ```bash
    npm install
    ```

3.  **Start the Server:**

    ```bash
    npm start
    ```

    The server will start on `http://localhost:3000`.

## 🧪 Testing Instructions

To test the real-time collaboration and room isolation:

1.  Open **two or more browser tabs** (or different browsers) and navigate to `http://localhost:3000`.
2.  In all windows, enter a **Username** (e.g., "User A") and the **same Room ID** (e.g., "alpha-test"). Click **Join**.
3.  **Draw and Sync:** Draw a line in one window; it will instantly appear in all others.
4.  **Test Undo/Redo:** Click the **Undo** button in any window. The last stroke (regardless of who drew it) will be removed from all screens. Click **Redo** to restore it.
5.  **Test Isolation:** Open a new tab and join a **different Room ID** (e.g., "beta-test"). The canvases will be completely isolated.

---

Once you create these files, run `git add .`, `git commit --amend`, and `git push -f` (to force the update to the latest commit). Your project will be fully ready for submission!