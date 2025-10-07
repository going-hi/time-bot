LOGIN = -
TOKEN_GH = -
IMAGE_NAME = time-bot
NAME_CONTAINER = bot-ebal-nahui

login:
	echo $(TOKEN_GH) | docker login ghcr.io -u $(LOGIN) --password-stdin

update:
	docker pull ghcr.io/$(LOGIN)/$(IMAGE_NAME):latest
	make stop
	make rm
	docker run -d --name $(NAME_CONTAINER) $(IMAGE_NAME)

rm:
	if docker inspect $(NAME_CONTAINER) >/dev/null 2>&1; then \
		echo "Удаляю нахуй контейнер $(NAME_CONTAINER)..."; \
		docker rm $(NAME_CONTAINER); \
	else \
		echo "Контейнер $(NAME_CONTAINER) не найден — пропускаю."; \
	fi

stop:
	if docker inspect $(NAME_CONTAINER) >/dev/null 2>&1; then \
		echo "Стопаю нахуй контейнер $(NAME_CONTAINER)..."; \
		docker stop $(NAME_CONTAINER); \
	else \
		echo "Контейнер $(NAME_CONTAINER) не найден — пропускаю."; \
	fi