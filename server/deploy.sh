#!/bin/bash
#
# A basic deploy tool for All the Dots.  Requires SSH access.

usage() {
  local ERRORMESSAGE="$1"
  tput rev  # reverse colors
  echo "***ERROR: $ERRORMESSAGE.***"
  tput sgr0 # reset to normal
  echo
  echo "Usage: $0 <ref> <server_name>"
  echo
  echo "  Eg: $0 112e7f9 dev"
  echo "  Eg: $0 v1.2.3 pro"
  echo
  echo "<ref> must be a valid ref (SHA or tag) in the Github repo."
  echo "<server_name> must be either 'dev' (development) or 'pro' (production)."
  echo
  echo "After deploy, the server's code will be exactly what that ref contains."
  echo
  exit 1
}

server=scoward@50.97.175.55
server_dir=webapps/allthedots_server
CWD=$(pwd)

silent='> /dev/null 2>&1'
#ssh $server "cd $server_dir; checkout '$ref' $silent && echo 'Done' || echo 'Failed (No such ref?)'"
ssh $server "killall server"
scp $server $CWD/server $server:$server_dir
scp $server $CWD/config.cfg $server:$server_dir
ssh $server "cd $server_dir; nohup ./server >> /home/scoward/logs/user/atd.log 2>&1 &"
