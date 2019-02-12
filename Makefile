.DEFAULT_GOAL := graph

node_modules:
	@echo Installing dependencies...
	@npm install && npm audit fix

dependencies: node_modules

graph: node_modules
	@clear
	@echo "\n\t*** Press Q or Esc to quit ***\n"
	@node src/index.js

test: node_modules
	@for spec in src/*.test.js; do node $$spec; done

.PHONY: dependencies graph test
