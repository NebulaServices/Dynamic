#!/bin/bash
echo "Welcome To Noctura!"

#Navigating to the project root
scriptDir="${0%/*}"
cd $scriptDir
cd ../
echo "Project Directory: $(pwd)"

while [[ $devAns != "dev" ]] || [[ $devAns != "prod" ]]
do
    echo "Dev or Prod? dev/prod"
    read devAns
    if [[ $devAns == "dev" ]] || [[ $devAns == "prod" ]]
    then
        break
    else
        echo "Invalid Input"
    fi
done

echo "Checking if packages are installed"
if ls | grep -q node_modules
then
    echo "node_modules found"

    while  [[ $cleanAns != "y" ]] || [[ $cleanAns != "n" ]]
    do
        echo "Would you like to reinstall? y/n"
        read cleanAns
        if [[ $cleanAns == "y" ]] || [[ $cleanAns == "n" ]]
        then
            break
        else
            echo "Invalid Input"
        fi
    done

    if [[ $cleanAns = "y" ]]
    then
        echo "Cleaning node_modules"
        rm -rf node_modules
        echo "Installing node_modules"
        npm install
    elif [[ $cleanAns = "n" ]]
    then
        echo "Skipping packages"
    fi

else
    echo "node_modules not found"

    while  [[ $installAns != "y" ]] || [[ $installAns != "n" ]]
    do
        echo "Would you like to install? y/n"
        read installAns
        if [[ $installAns == "y" ]] || [[ $installAns == "n" ]]
        then
            break
        else
            echo "Invalid Input"
        fi
    done
    
    if [[ $installAns == "y" ]]
    then
        echo "Installing node_modules"
        npm install
    elif [[ $installAns == "n" ]]
    then
        echo "Skipping packages"
    fi
fi

while [[ $buildAns != "build" ]] || [[ $buildAns != "start" ]] || [[ $buildAns != "both" ]]
do
    echo "Would you like to build, start, or both? build/start/both"
    read buildAns
    if [[ $buildAns == "build" ]] || [[ $buildAns == "start" ]] || [[ $buildAns == "both" ]]
    then
        break
    else
        echo "Invalid Input"
    fi
done

if [[ $buildAns == "build" ]]
then
    echo "Building Dynamic"
    npm run build:$devAns
elif [[ $buildAns == "start" ]]
then
    echo "Starting Dynamic"
    npm run start
elif [[ $buildAns == "both" ]]
then
    echo "Doing Both!"
    echo "Building Dynamic"
    npm run build:$devAns
    echo "Starting Dynamic :)"
    npm run start
fi