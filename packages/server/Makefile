all: dependencies lint prettier test build 

dependencies: package.json yarn.lock
ifdef CI
	yarn install --frozen-lockfile --silent
else
	yarn install
endif

.PHONY: test
test: 
ifdef CI
	yarn test
else
	yarn test -u
endif

.PHONY: prettier
prettier: 
ifdef CI
	yarn prettier --check
else
	yarn prettier
endif

.PHONY: lint
lint: 
ifdef CI
	yarn lint
else
	yarn lint --fix
endif

.PHONY: typecheck
typecheck:
	yarn typecheck

.PHONY: build
build:
	yarn build

.PHONY: clean
clean:
	rm -rf build
	rm -rf node_modules