FROM python:3.6
MAINTAINER muxistudio <muxistudio@qq.com>
ENV DEPLOY_PATH /consume-chart
RUN mkdir -p $DEPLOY_PATH
WORKDIR $DEPLOY_PATH
Add . .
RUN pip install pipenv
RUN pipenv install --system --deploy
