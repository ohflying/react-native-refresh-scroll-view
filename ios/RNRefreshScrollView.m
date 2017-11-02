
#import "RNRefreshScrollView.h"
#import "RefreshScrollView.h"

@implementation RNRefreshScrollView

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE(RefreshScrollView)


- (UIView *)view
{
    return [[RefreshScrollView alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

RCT_EXPORT_METHOD(fling)
{
    RCTLog(@"fling!!!!");
}

@end
  
