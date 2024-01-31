# Habit Tracker Web app
## MVP requirements
1. User can start/pause/stop a session to record sessions
2. User can view all past sessions
3. User can login to access only information relevant to them
4. User can view advanced analytics of their sessions over time corellated with data from Google Fit or other health trackers/monitors

## Node config
- Make sure you set legacy peer deps: `npm config set legacy-peer-deps=true`

## Deploying on AWS
- Linux machine requires: sudo apt-get install -y libkrb5-dev
- Guide to deploy backend on AWS EC2: https://medium.com/@vanyamyshkin/deploy-python-fastapi-for-free-on-aws-ec2-050b46744366
- Guide to deploy frontend on AWS EC2: https://medium.com/@mudasirhaji/deploying-a-next-js-app-manually-on-aws-ec2-a-step-by-step-guide-58b266ff1c52
- Additional guide for nginx frontend setup: https://medium.com/@asttle1997/deploying-your-next-js-app-to-ec2-with-nginx-and-pm2-7afc6d878f5b

