# Cloudfront Manager

GitHub Action for updating the Origin Path for given Distribution

## Inputs
*details will be added...*

## Usage Example

````yaml
name: Deployment
jobs:
  deploy:
    name: Package
    steps:
      - uses: actions/checkout@v3
      # your stuff
      - name: Update OriginPath
        uses: mean-dao/cloudfront-manager@v1
        with:
          ORIGIN_PATH: '/v1/new_path'
          AWS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DISTRIBUTION_ID: ${{ secrets.DISTRIBUTION_ID }}
````
