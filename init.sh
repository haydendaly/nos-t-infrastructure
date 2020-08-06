#/bin/bash
GREEN='\n\033[1;32m'
NC='\033[0m\n'

echo -e "${GREEN}Cloning all repos... this will take a moment!${NC}"

rm -rf components
mkdir components

river_node_repo="git@gitlab.code-lab.org:testbed-2020/river-node.git"
river_node_dir="./components/river-node"

git clone "$river_node_repo" "$river_node_dir"

weather_node_repo="git@gitlab.code-lab.org:testbed-2020/weather-node.git"
weather_node_dir="./components/weather-node"

git clone "$weather_node_repo" "$weather_node_dir"

vapsat_repo="git@gitlab.code-lab.org:testbed-2020/vapsat.git"
vapsat_dir="./components/vapsat"

git clone "$vapsat_repo" "$vapsat_dir"

mattsat_repo="git@gitlab.code-lab.org:mbrand/mattsat.git"
mattsat_dir="./components/mattsat"

git clone "$mattsat_repo" "$mattsat_dir"

echo -e "${GREEN}All repos cloned, ready to go!${NC}"