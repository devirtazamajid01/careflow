require "test_helper"

class Api::AppointmentsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_appointments_index_url
    assert_response :success
  end

  test "should get create" do
    get api_appointments_create_url
    assert_response :success
  end
end
