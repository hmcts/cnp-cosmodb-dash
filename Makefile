.DEFAULT_GOAL := graph

dependencies: node_modules

node_modules:
	@echo Installing dependencies...
	@npm install && npm audit fix

graph: node_modules
	@clear
	@echo "\n\n\t\tINFO: *** Press Q or Esc to quit ***\n\n"
	@node src/graph.js

test: node_modules
	@node src/utils.test.js

.PHONY: dependencies graph test
