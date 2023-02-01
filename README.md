A minimal server to save the state of a [Theatre.js](https://www.theatrejs.com) project to disk.

## Installation

```bash
git clone git@github.com:AriaMinaei/minimal-theatre-state-server.git
cd minimal-theatre-state-server
yarn install
```

## Usage

```bash
yarn start path/to/a/folder/to/hold/the/state --port CHOOSE_A_PORT
```

This will start a server that will save the state of a Theatre.js project to the folder you specified.

Next, in your client-side code where you setup `@theatre/studio`, add the following:

```js
import studio from '@theatre/studio'

/**
 * You can use this function to save the state of your project to the server.
 * @param host The host of the server, e.g. http://localhost:3000 (use the port you chose when you started the server)
 * @param projectId The ID of the project you want to save (as in `projectId` in `getProject(projectId)`)
 * @returns A promise that resolves when the state is saved to the server
 */
async function saveStateToServer(host: string, projectId: string) {
  const state = studio.createContentOfSaveFile(projectId)

  await fetch(`${host}/states/space`, {
    body: JSON.stringify(state),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log(`Saved ${projectId} to the server`)
}

// now you can call `saveStateToServer` whenever you want to save the state of your project to the server.

// Here we'll create a small Theatre.js extension that will show a button in the toolbar:
studio.extend({
  id: 'Saver',
  toolbars: {
    global: (set, studio) => {
      set([
        {
          type: 'Icon',
          svgSource: 'S',
          title: 'Save to server',
          onClick: () => {
            saveStateToServer('http://localhost:8001', 'Space')
          },
        },
      ])

      return () => {}
    },
  },
})

studio.initialize()
```

