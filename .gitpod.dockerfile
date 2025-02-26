FROM gitpod/workspace-full-vnc:latest

RUN sudo sh -c "echo deb-src http://archive.ubuntu.com/ubuntu/ focal main restricted >> /etc/apt/sources.list" \
 && sudo sh -c "echo deb-src http://archive.ubuntu.com/ubuntu/ focal-updates main restricted >> /etc/apt/sources.list" \
 && sudo sh -c "echo deb-src http://security.ubuntu.com/ubuntu/ focal-security main restricted >> /etc/apt/sources.list" \
 && sudo sh -c "echo deb-src http://security.ubuntu.com/ubuntu/ focal-security universe >> /etc/apt/sources.list" \
 && sudo sh -c "echo deb-src http://security.ubuntu.com/ubuntu/ focal-security multiverse >> /etc/apt/sources.list" \
 && sudo apt-get update \
 && sudo apt-get install -y \
    build-essential git libpoco-dev libcap-dev python3-polib npm libpng-dev libzstd-dev python3-lxml libpam-dev libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev librsvg2-dev firefox chromium-browser \
 && sudo apt-get build-dep -y libreoffice \
 && pip install lxml \
 && pip install polib \
 && sudo rm -rf /var/lib/apt/lists/*

 # FROM 10.0.35.16:5000/aspnet:6.0
FROM 10.0.35.16:5000/ubuntu:22.04
 # USER root
 # 修改 apt 源为阿里云镜像
 RUN echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib" > /etc/apt/sources.list && \
     # 删除 apt 缓存
     # 清理 apt 缓存并更新源
     apt-get clean && \
     apt-get update && \
     # 查看修改后的 sources.list 文件内容
     cat /etc/apt/sources.list

# refresh repos otherwise installations later may fail
# install LibreOffice run-time dependencies
# install adduser, findutils, openssl and cpio that we need later
# install tzdata to accept the TZ environment variable
# install an editor
# tdf#117557 - Add CJK Fonts to Collabora Online Docker Image
RUN apt-get -y install libpng16-16 fontconfig adduser cpio tzdata \
               findutils nano \
               libcap2-bin openssl openssh-client \
               libxcb-shm0 libxcb-render0 libxrender1 libxext6 \
               fonts-wqy-zenhei fonts-wqy-microhei fonts-droid-fallback \
               fonts-noto-cjk ca-certificates


               RUN |8 author= releasenotes= version=24.04.12.4 coretag=cp-24.04.12-4 onlinetag=cp-24.04.12-4 repo= type= nobrand= /bin/sh -c apt-get update 
               &&     apt-get -y install cpio tzdata libcap2-bin apt-transport-https gnupg2 ca-certificates curl 
               &&     repourl="https://collaboraoffice.com/${repo:-repos}/CollaboraOnline/";     secret_key=$(cat /run/secrets/secret_key);     if [ "$type" = "cool" ] && [ -n ${secret_key+set} ]; then         echo "Based on the provided build arguments Collabora Online from customer repo will be used.";         repourl="${repourl}24.04/customer-deb-${secret_key}/";     elif [ "$type" = "key" ]; then         echo "Based on the provided build arguments license key enabled Collabora Online will be used.";         repourl="${repourl}24.04-key/";     else         echo "Based on the provided build arguments Collabora Online Development Edition will be used.";         repourl="${repourl}24.04-CODE/CODE-deb/";     fi &&     echo "deb [signed-by=/usr/share/keyrings/collaboraonline-release-keyring.gpg] ${repourl} /" > /etc/apt/sources.list.d/collabora.list &&     if [ "$repo" = "repos-snapshot" ]; then         curl https://www.collaboraoffice.com/downloads/gpg/collaboraonline-snapshot-keyring.gpg --output /usr/share/keyrings/collaboraonline-snapshot-keyring.gpg;         sed -i "s/collaboraonline-release-keyring/collaboraonline-snapshot-keyring/" /etc/apt/sources.list.d/collabora.list;     else         curl https://www.collaboraoffice.com/downloads/gpg/collaboraonline-release-keyring.gpg --output /usr/share/keyrings/collaboraonline-release-keyring.gpg;     fi 
               &&     apt-get update &&     apt-get -y install coolwsd coolwsd-deprecated                        collaboraoffice-dict-*                        collaboraofficebasis-ar                        collaboraofficebasis-bg                        collaboraofficebasis-ca                        collaboraofficebasis-cs                        collaboraofficebasis-da                        collaboraofficebasis-de                        collaboraofficebasis-el                        collaboraofficebasis-en-gb                        collaboraofficebasis-en-us                        collaboraofficebasis-eo                        collaboraofficebasis-es                        collaboraofficebasis-eu                        collaboraofficebasis-fi                        collaboraofficebasis-fr                        collaboraofficebasis-gl                        collaboraofficebasis-he                        collaboraofficebasis-hr                        collaboraofficebasis-hu                        collaboraofficebasis-id                        collaboraofficebasis-is                        collaboraofficebasis-it                        collaboraofficebasis-ja                        collaboraofficebasis-ko                        collaboraofficebasis-lo                        collaboraofficebasis-nb                        collaboraofficebasis-nl                        collaboraofficebasis-oc                        collaboraofficebasis-pl                        collaboraofficebasis-pt                        collaboraofficebasis-pt-br                        collaboraofficebasis-ru                        collaboraofficebasis-sk                        collaboraofficebasis-sl                        collaboraofficebasis-sq                        collaboraofficebasis-sv                        collaboraofficebasis-tr                        collaboraofficebasis-uk                        collaboraofficebasis-vi                        collaboraofficebasis-zh-cn                        collaboraofficebasis-zh-tw &&     if [ -z "$nobrand" ]; then         if [ "$type" = "cool" ] || [ "$type" = "key" ]; then             apt-get -y install collabora-online-brand;         else             apt-get -y install code-brand;         fi;     fi &&     chown cool:cool /etc/coolwsd 
               &&     dpkg --purge  --force-remove-essential --ignore-depends=perl-base perl-base 
               &&     rm -rf /var/lib/apt/* &&     rm -rf /etc/coolwsd/proof_key* # buildkit

# copy freshly built LOKit and Collabora Online
COPY /instdir /

# copy the shell script which can start Collabora Online (coolwsd)
COPY /start-collabora-online.sh /

# set up Collabora Online (normally done by postinstall script of package)
# Fix permissions
RUN setcap cap_fowner,cap_chown,cap_sys_chroot=ep /usr/bin/coolforkit-caps && \
    setcap cap_sys_admin=ep /usr/bin/coolmount && \
    adduser --quiet --system --group --home /opt/cool cool && \
    rm -rf /opt/cool && \
    mkdir -p /opt/cool/child-roots /opt/cool/cache && \
    coolwsd-systemplate-setup /opt/cool/systemplate /opt/lokit >/dev/null 2>&1 && \
    touch /var/log/coolwsd.log && \
    chown cool:cool /var/log/coolwsd.log && \
    chown -R cool:cool /opt/ && \
    chown -R cool:cool /etc/coolwsd

EXPOSE 9980

# switch to cool user (use numeric user id to be compatible with Kubernetes Pod Security Policies)
USER 100

ENTRYPOINT ["/start-collabora-online.sh"]
 