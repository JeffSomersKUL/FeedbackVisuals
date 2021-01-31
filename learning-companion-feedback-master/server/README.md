#

## Converting files to json
- Execute in `server` folder: `ts-node src/dataProcessor.ts 13 wb`

## Generating random editor_keys
- `node -e "console.log(Math.random().toString(36).substring(2)+Math.random().toString(36).substring(2))"`