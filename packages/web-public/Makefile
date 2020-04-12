all: typecheck lint prettier build

.PHONY:	dependencies
dependencies:
ifdef CI
	yarn install --frozen-lockfile --silent
else
	yarn install
endif

.PHONY: prettier
prettier:
ifdef CI
	yarn prettier --check
else
	yarn prettier
endif

.PHONY:	lint
lint:
ifdef	CI
	yarn lint
else
	yarn lint --fix
endif

.PHONY:	typecheck
typecheck:
	yarn typecheck


.PHONY:	build
build:
	yarn build
