import React from 'react';
import PropTypes from 'prop-types';
import CloudinaryComponent from '../CloudinaryComponent';
import {extractCloudinaryProps} from '../../Util';
import {CloudinaryContextType} from './CloudinaryContextType';

/**
 * Provides a container for Cloudinary components. Any option set in CloudinaryContext will be passed to the children.
 *
 * @example
 *<CloudinaryContext cloudName="mycloud" dpr="auto">
 *    <!-- other tags -->
 *    <Image publicId={id}/>
 *</CloudinaryContext>
 *
 */
class CloudinaryContext extends CloudinaryComponent {
  constructor(props, context) {
    super(props, context);

    this.calcState = this.calcState.bind(this);
    this.state = this.calcState();
  }

  /**
   * Calculates current state
   * @returns {context, childrenProps, includeOwnBody}
   */
  calcState() {
    const context = this.context || {}; //context might not exist
    const props = {...context, ...this.props}; //merge context with props

    //split the props to cloudinary/non-cloudinary props
    const {cloudinaryProps, nonCloudinaryProps} = extractCloudinaryProps(
      props, CloudinaryContext.CLOUDINARY_PROPS
    );

    //extract includeOwnBody which is used only by this context and should not be passed to children
    const {includeOwnBody, ...childrenProps} = nonCloudinaryProps;

    return {
      context: cloudinaryProps,
      childrenProps,
      includeOwnBody
    };
  }

  render() {
    const {children} = this.props;
    const {context, childrenProps, includeOwnBody} = this.state;

    return (
      <CloudinaryContextType.Provider value={context}>
        {includeOwnBody ? children : <div {...childrenProps}>{children}</div>}
      </CloudinaryContextType.Provider>
    );
  }
}

// Map Cloudinary props from array to object for efficient lookup
CloudinaryContext.CLOUDINARY_PROPS = CloudinaryComponent.VALID_OPTIONS.reduce(
  (accumulator, cloudinaryPropName) => {
    accumulator[cloudinaryPropName] = true;
    return accumulator;
  },
  {}
);

CloudinaryContext.propTypes = {...CloudinaryComponent.propTypes, includeOwnBody: PropTypes.bool};
CloudinaryContext.defaultProps = {includeOwnBody: false};
CloudinaryContext.contextType = CloudinaryContextType;

export default CloudinaryContext;
