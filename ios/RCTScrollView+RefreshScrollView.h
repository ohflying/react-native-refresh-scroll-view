//
//  RCTScrollView+RefreshScrollView.h
//  RNRefreshScrollView
//
//  Created by admin on 2017/10/16.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RCTScrollView.h"

@interface RCTScrollView (RefreshScrollView)

- (void) stopFling;

- (void)fling:(CGFloat) velocity withDeceleration: (CGFloat)deceleration;

@end
