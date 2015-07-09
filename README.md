# h5-mobile

针对移动端开发的JavaScript组件库


## git 多账号设置

1. 创建git仓库时，user.name, user.email不要作全局配置，用--local代替--global：

    git config --local user.name "username"
    git config --local user.email "email"


2. ~/.ssh/下添加config文件，配置多个账号信息：

    Host github.com
        HostName github.com
        User username1
        PreferredAuthentications publickey
        IdentityFile ~/.ssh/id_rsa_username1

    Host bitbucket.org
        HostName bitbucket.org
        User username2
        PreferredAuthentications publickey
        IdentityFile ~/.ssh/id_rsa_username2

以github 和 bitbucket两个账号为例，这里`IdentityFile`是指生成的ssh key文件路径。为区分不同账号，生成ssh key时，重命名rsa文件。

3. 接下来可以进入~/.ssh/文件夹下，分别为不同账号生成ssh key (rsa)文件，注意提示`Enter file in which to save the key (/c/Users/zhong/.ssh/id_rsa): `时，要重命名rsa文件，如：`/c/Users/zhong/.ssh/id_rsa_github_summer`，用来区分不同账号。

    $ ssh-keygen -t rsa -C "testemail@test.com"
    Generating public/private rsa key pair.
    Enter file in which to save the key (/c/Users/zhong/.ssh/id_rsa): /c/Users/zhong/.ssh/id_rsa_github_summer
    Enter passphrase (empty for no passphrase):
    Enter same passphrase again:
    Your identification has been saved in /c/Users/zhong/.ssh/id_rsa_github_summer.
    Your public key has been saved in /c/Users/zhong/.ssh/id_rsa_github_summer.pub.
    The key fingerprint is:
    （略）