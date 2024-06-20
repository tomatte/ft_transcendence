import pong
import utils

print(utils.is_point_inside_rect([-30, -30], [30, 30], [10, 10]))
print(utils.is_point_inside_rect([1280, 720 + 30], [1280 + 30, -30], [1285, 400]))

utils.is_point_inside_rect([1280, 750], [1310, -30], [1285, 400])

print(f"BOTTOM_SIDE -> {pong.Table.bottom_side}")
print(f"UP_SIDE -> {pong.Table.up_side}")
print(f"LEFT_SIDE -> {pong.Table.left_side}")
print(f"RIGHT_SIDE -> {pong.Table.right_side}")