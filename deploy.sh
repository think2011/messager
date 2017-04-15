HOST=root@ss.think2011.net
SCRIPTS="
    cd apps/messager;

    echo '*** 获取代码 ***';
    git pull;
    echo;

    echo '*** 更新依赖 ***';
    yarn;
    echo;

    echo '*** 重启服务 ***';
    pm2 reload messager;
    echo;
"

ssh ${HOST} ${SCRIPTS}

