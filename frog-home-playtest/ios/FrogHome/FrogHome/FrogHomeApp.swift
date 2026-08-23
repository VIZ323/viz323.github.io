import SwiftUI

@main
struct FrogHomeApp: App {
    var body: some Scene {
        WindowGroup {
            GameWebView()
                .background(Color(red: 0.73, green: 0.88, blue: 0.80))
                .ignoresSafeArea()
        }
    }
}
