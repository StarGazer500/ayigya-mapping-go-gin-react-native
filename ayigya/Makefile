.PHONY: expoclean expostartclean expohardreset expostart

expoclean:
	@echo "Cleaning npm cache and temp files..."
	npm cache clean --force
	watchman watch-del-all
	rm -rf /tmp/haste-map-*
	rm -rf /tmp/metro-cache
	rm -rf ~/.metro

expostartclean: expoclean
	@echo "Starting Expo with clear cache..."
	npx expo start --clear

expostart:
	npx expo start

expohardreset: expostart
	rm -rf node_modules
	npm install
	npx expo start

connectoadb:
	echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="04e8", MODE="0666", GROUP="plugdev"' | sudo tee /etc/udev/rules.d/51-android-usb.rules

chckconndev:
	adb devices
