LOGIN = -
TOKEN_GH = -
IMAGE_NAME = time-bot
NAME_CONTAINER = bot-ebal-nahui

login:
	echo $(TOKEN_GH) | docker login ghcr.io -u $(LOGIN) --password-stdin
update:
	docker pull ghcr.io/$(LOGIN)/$(IMAGE_NAME):latest
	docker stop $(NAME_CONTAINER)
	docker rm $(NAME_CONTAINER) || true
	docker run -d --name $(NAME_CONTAINER) -p 80:80 $(IMAGE_NAME)
