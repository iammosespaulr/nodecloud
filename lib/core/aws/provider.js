const awsSDk = require("aws-sdk");
const EC2 = require("../../compute/aws-ec2");
const EBS = require("../../storage/aws-ebs");
const S3 = require("../../storage/aws-s3");

class AWS {
  /**
   * Expose AWS APIs
   * @constructor
   */
  constructor(configPath) {
    this._AWS = awsSDk;

    if (
      !this._AWS.config.credentials.accessKeyId ||
      !this._AWS.config.credentials.region
    ) {
      if (configPath) {
        this._AWS.config.loadFromPath(configPath);
      } else {
        throw new Error('Provide credentials <link to docs>');
      }
    }

    return {
      getSDK: () => this._AWS,
      compute: this.EC2,
      storage: this.EBS,
      s3: this.S3
    };
  }
  /**
   * EC2 Wrapper
   * @EC2
   * @param {object} options - { apiVersion }
   */
  EC2(options) {
    this._apiVersion = options.apiVersion;
    return new EC2(this.getSDK(), this._apiVersion);
  }
  /**
   * EBS Wrapper
   * @EBS
   * @param {object} options - { apiVersion }
   */
  EBS(options) {
    this._apiVersion = options.apiVersion;
    return new EBS(this.getSDK(), this._apiVersion);
  }

  S3(options) {
    if(options._apiVersion) {
      this._apiVersion = options.apiVersion;
      return new S3(this.getSDK(), this.apiVersion);
    }
    return new S3(this.getSDK());
  }
}

module.exports = AWS;