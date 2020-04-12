all: web-public server

.PHONY: server
server:
	cd $(CURDIR)/packages/server && $(MAKE)

.PHONY: web-public
web-public:
	cd $(CURDIR)/packages/web-public && $(MAKE)

.PHONY: dependencies
dependencies: dependencies-web-public dependencies-server

.PHONY: dependencies-web-public
dependencies-web-public:
	cd $(CURDIR)/packages/web-public && $(MAKE) dependencies

.PHONY: dependencies-server
dependencies-server:
	cd $(CURDIR)/packages/server && $(MAKE) dependencies


