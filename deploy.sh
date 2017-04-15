HOST=root@ss.think2011.net
SCRIPTS="
    cd apps/messager;
    git pull;
    yarn;
    pm2 reload;
"

ssh ${HOST} ${SCRIPTS}

