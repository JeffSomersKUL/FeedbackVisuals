#!/bin/sh
if [ -d "persist/config" ] ; then
    echo "persist/config exists, fetching"
    cd persist
    git fetch
    git pull
    cd -
else
    echo "Cloning because persist/config does not exist."
    git clone git@gitlab.kuleuven.be:vlir-ijkingstoets-feedback/feedback-dashboard-data.git persist
fi
npm run start:raw