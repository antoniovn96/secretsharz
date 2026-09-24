# Example remote-state configuration.
# Do not use until the bootstrap state bucket has been created.

bucket       = "REPLACE_WITH_SECRET_SHARZ_TERRAFORM_STATE_BUCKET"
key          = "REPLACE_WITH_ENVIRONMENT/state.tfstate"
region       = "ap-south-1"
use_lockfile = true
encrypt      = true
