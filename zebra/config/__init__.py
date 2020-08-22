from config.dev import config as dev_config
from config.prod import config as prod_config
import os

# environment = os.environ['PYTHON_ENV'] or 'development'
environment = 'development'
environment_config = None
if environment == 'development':
    environment_config = dev_config
elif environment == 'production':
    environment_config = prod_config

def chain_configs(*config_items): 
    for it in config_items: 
        for element in it: 
            value = element[1] 
            if value is not None: 
                yield element 

# config = dict(chain_configs(*default_config.items(), environment_config.items, envs.items()))
config = environment_config
