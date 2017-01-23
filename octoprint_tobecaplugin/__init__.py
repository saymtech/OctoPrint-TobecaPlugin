# coding=utf-8
from __future__ import absolute_import

### (Don't forget to remove me)
# This is a basic skeleton for your plugin's __init__.py. You probably want to adjust the class name of your plugin
# as well as the plugin mixins it's subclassing from. This is really just a basic skeleton to get you started.

import octoprint.plugin

class TobecaPlugin(octoprint.plugin.TemplatePlugin,
					octoprint.plugin.StartupPlugin):
    def on_after_startup(self):
        self._logger.info("Plugin Tobeca!")
        
	def get_assets(self):
		return dict(
			js=["js/tobeca_reglages.js"]
		)
      
	def get_template_configs(self):
		files = [
            dict(type="tab", template="tobeca_reglages_tab.jinja2", custom_bindings=True,div="reglages",name="Tobeca"),
		]


		return files

        

# If you want your plugin to be registered within OctoPrint under a different name than what you defined in setup.py
# ("OctoPrint-PluginSkeleton"), you may define that here. Same goes for the other metadata derived from setup.py that
# can be overwritten via __plugin_xyz__ control properties. See the documentation for that.
__plugin_name__ = "Plugin Tobeca"
__plugin_implementation__ = TobecaPlugin()
